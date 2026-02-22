import os, glob, re

for file in glob.glob("*.html"):
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()

    # Handle canonical for ac-repair
    if file == "ac-repair-houston.html" and '<link rel="canonical"' not in content:
        content = re.sub(r'(</title>)', r'\1\n    <link rel="canonical" href="https://texasrightchoice.com/ac-repair-houston.html" />', content, count=1, flags=re.IGNORECASE)

    # Handle meta robots for utility pages
    if file in ["privacy-policy.html", "terms-of-service.html", "thank-you.html"]:
        if "noindex, nofollow" not in content:
            content = re.sub(r'(<head>)', r'\1\n    <meta name="robots" content="noindex, nofollow">', content, count=1, flags=re.IGNORECASE)
            
    # Restrict h1, h2, h3
    for tag in ['h1', 'h2', 'h3']:
        # Regex to find <hX ...> or <hX>
        matches = list(re.finditer(rf'(<{tag}\b[^>]*>)(.*?)(</{tag}>)', content, re.IGNORECASE | re.DOTALL))
        if len(matches) > 1:
            # We keep matches[0], replace matches[1:]
            for m in reversed(matches[1:]): # reverse to avoid index shifts
                open_tag = m.group(1)
                inner = m.group(2)
                close_tag = m.group(3)
                
                # Replace <hX with <div
                new_open = re.sub(rf'^<{tag}', '<div', open_tag, count=1, flags=re.IGNORECASE)
                new_close = '</div>'
                
                # Add class
                if 'class="' in new_open:
                    new_open = re.sub(r'class="([^"]*)"', rf'class="\1 {tag}-style"', new_open, count=1)
                elif "class='" in new_open:
                    new_open = re.sub(r"class='([^']*)'", rf"class='\1 {tag}-style'", new_open, count=1)
                else:
                    new_open = new_open.replace('>', rf' class="{tag}-style">', 1)
                
                start, end = m.span()
                content = content[:start] + new_open + inner + new_close + content[end:]
                
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)

with open("robots.txt", "r", encoding="utf-8") as f:
    r_content = f.read()
if "terms-and-conditions.html" in r_content:
    r_content = r_content.replace("terms-and-conditions.html", "terms-of-service.html")
    with open("robots.txt", "w", encoding="utf-8") as f:
        f.write(r_content)
