import glob, re

files = glob.glob('d:/RERC_static_web/**/*.html', recursive=True) + glob.glob('d:/RERC_static_web/*.html')
files = list(set(files))

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'footer.css' not in content:
        # We need to find announcement.css and replace it with announcement.css AND footer.css
        # To handle both relative and root absolute paths.
        res = re.search(r'<link.*?href="([^"]*)announcement\.css".*?>', content)
        if res:
            prefix = res.group(1) # Could be '/css/' or 'css/'
            new_link = f'<link rel="stylesheet" href="{prefix}footer.css" />'
            content = content.replace(res.group(0), f"{res.group(0)}\n    {new_link}")
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print("Updated", filepath)
        else:
            print("Could not find announcement.css in", filepath)
            
