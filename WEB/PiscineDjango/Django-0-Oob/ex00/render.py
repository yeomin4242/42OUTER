import re
import sys

def render(template_file, output_file):
    # Read template file
    if template_file.strip().split('.')[1] == "template" :
        with open(template_file, 'r') as f:
            template = f.read()
    else :
        sys.exit(1)

    # Read variables from settings.py
    settings_globals = {}
    with open('settings.py', 'r') as settings_file:
        for line in settings_file:
            if '=' in line:
                key, value = line.strip().split('=')
                settings_globals[key.strip()] = value.strip().strip('"')

    # Replace placeholders with values from settings
    placeholders = re.findall(r'{(.*?)}', template)
    for placeholder in placeholders:
        if placeholder in settings_globals:
            template = template.replace('{' + placeholder + '}', str(settings_globals[placeholder]))

    # Write rendered content to output file
    with open(output_file, 'w') as f:
        f.write(template)
    
    f.close()
    settings_file.close()

# Main function to render the template
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python render.py <template_file>")
        sys.exit(1)
    template_file = sys.argv[1]
    output_file = f"{template_file.split('.')[0]}.html"
    render(template_file, output_file)