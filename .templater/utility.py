#!/usr/bin/env python3

import re

def update_html_section(html_file_path, content_template_path, section_start_marker, section_end_marker):
    """
    A professional, one-pass approach to updating an HTML section.
    """
    try:
        # Read the new content from the template file
        with open(content_template_path, 'r') as template_file:
            new_content = template_file.read().strip()

        # Read the entire HTML file
        with open(html_file_path, 'r') as html_file:
            current_html_content = html_file.read()

        # Build the regex pattern using the markers
        # The 're.DOTALL' flag is crucial for multiline matches
        pattern = re.escape(section_start_marker) + r'.*?' + re.escape(section_end_marker)

        # The new content should include the original markers
        replacement_content = section_start_marker + '\n\n' + new_content + '\n\n' + section_end_marker

        # Replace the old section with the new content
        modified_html_content = re.sub(pattern, replacement_content, current_html_content, flags=re.DOTALL)

        # Write the modified content back to the file
        with open(html_file_path, 'w') as file_writer:
            file_writer.write(modified_html_content)

        print(f"Successfully updated section in {html_file_path}")

    except FileNotFoundError as e:
        print(f"Error: File not found: {e.filename}")
    except IOError as e:
        print(f"Error: I/O error occurred: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
