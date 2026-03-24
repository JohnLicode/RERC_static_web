import os
import glob
import re

css_files = glob.glob('css/*.css')

for file in css_files:
    with open(file, 'r', encoding='utf-8') as f:
        text = f.read()

    # Desktop Nav item
    text = re.sub(
        r'\.nav-item:hover\s*\{\s*background:\s*#f16901;\s*color:\s*white;\s*\}',
        '.nav-item:hover {\\n  background: transparent;\\n  color: #1a5f3f;\\n  box-shadow: inset 0 -4px 0 #f16901;\\n}',
        text
    )

    text = re.sub(
        r'\.nav-item\.active\s*\{\s*background:\s*#f16901;\s*color:\s*white;\s*\}',
        '.nav-item.active {\\n  background: transparent;\\n  color: #1a5f3f;\\n  box-shadow: inset 0 -4px 0 #f16901;\\n}',
        text
    )

    # Mobile Nav Item
    text = re.sub(
        r'\.mobile-nav-item:hover,\s*\.mobile-nav-item\.active\s*\{\s*background:\s*#f16901;\s*color:\s*white;\s*\}',
        '.mobile-nav-item:hover,\\n.mobile-nav-item.active {\\n  background: rgba(26, 95, 63, 0.05);\\n  color: #1a5f3f;\\n  box-shadow: inset 4px 0 0 #f16901;\\n}',
        text
    )

    # Replace gold gradients to Academic Green gradients for buttons (Process Flow Labels)
    text = text.replace('background: linear-gradient(135deg, #f16901, #ff8400);', 'background: #1a5f3f;')

    # Carousel dots
    text = text.replace('background-color: #f16901;\n  border-color: #f16901;', 'background-color: #f16901;\n  border-color: #f16901;')
    
    # Download btn hover #f16901 -> #0c2b14
    text = re.sub(r'(\.download-btn:hover\s*\{\s*background:\s*)#f16901;', r'\1#0c2b14;', text)

    # Back to Top Hover #f16901 -> #1a5f3f
    text = re.sub(r'(#backToTop:hover\s*\{\s*background:\s*)#f16901;', r'\1#1a5f3f;', text)

    # Process label hover #f16901 -> #0c2b14 (actually wait, box shadow)
    text = text.replace('box-shadow: 0 4px 12px rgba(241, 105, 1, 0.4);', 'box-shadow: 0 4px 12px rgba(26, 95, 63, 0.4);')
    text = text.replace('box-shadow: 0 2px 6px rgba(241, 105, 1, 0.3);', 'box-shadow: 0 2px 6px rgba(26, 95, 63, 0.3);')

    # Login btn hover #ff8400 -> #0c2b14 and border
    text = text.replace('background: #ff8400;\n  color: #ffffff;\n  text-decoration: none;\n  /* Removed transform: translateY(-2px) to keep button fixed */\n  box-shadow: 0 6px 20px rgba(255, 132, 0, 0.3);\n  border: 2px solid #ff8400;', 'background: #0c2b14;\n  color: #ffffff;\n  text-decoration: none;\n  box-shadow: 0 6px 20px rgba(12, 43, 20, 0.3);\n  border: 2px solid #0c2b14;')

    # Carousel hover prev/next background
    text = text.replace('background: rgba(241, 105, 1, 0.8);', 'background: rgba(26, 95, 63, 0.8);')
    text = text.replace('background: rgba(241, 105, 1, 1);', 'background: rgba(26, 95, 63, 1);')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(text)

