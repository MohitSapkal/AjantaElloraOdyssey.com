import os
import glob
import re

html_files = glob.glob('public/*.html')

with open('public/index.html', 'rb') as f:
    index_content = f.read()

# Extract Navigation
nav_match = re.search(rb'(<!-- Navigation -->\s*<nav class="navbar">.*?</nav>)', index_content, re.DOTALL)
if not nav_match:
    print("Could not find Navigation in index.html")
    exit(1)
nav_html = nav_match.group(1)

# Extract Footer
footer_match = re.search(rb'(<!-- Footer -->\s*<footer class="footer">.*?</footer>)', index_content, re.DOTALL)
if not footer_match:
    print("Could not find Footer in index.html")
    exit(1)
footer_html = footer_match.group(1)

for file in html_files:
    if os.path.basename(file) == 'index.html':
        continue
    
    with open(file, 'rb') as f:
        content = f.read()
    
    # Replace Navigation
    new_content = re.sub(rb'<!-- Navigation -->\s*<nav class="navbar">.*?</nav>', nav_html, content, flags=re.DOTALL)
    
    # Replace Footer (handle some pages that might not have <!-- Footer --> but rather just <footer class="footer">, let's just do standard)
    new_content = re.sub(rb'<!-- Footer -->\s*<footer class="footer">.*?</footer>', footer_html, new_content, flags=re.DOTALL)
    
    if new_content != content:
        with open(file, 'wb') as f:
            f.write(new_content)
        print(f"Updated {file}")
    else:
        print(f"No changes needed for {file}")

print("Done updating nav and footer.")
