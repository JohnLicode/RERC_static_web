import glob, re, os

html_files = glob.glob('d:/RERC_static_web/**/*.html', recursive=True) + glob.glob('d:/RERC_static_web/*.html')
html_files = list(set(html_files))

with open('new_footer.html', 'r', encoding='utf-8') as f:
    new_footer = f.read()

for filepath in html_files:
    if 'index.html' not in filepath: continue
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if '<footer class="footer">' in content:
            new_content = re.sub(r'<footer class="footer">.*?</footer>', new_footer, content, flags=re.DOTALL)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print('Updated', filepath)
    except Exception as e:
        print('Error on', filepath, e)
