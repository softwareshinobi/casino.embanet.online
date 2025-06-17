#!/usr/bin/env python3
# utility.py

import re

def update_html_section(htmlFilePath, content_template_filepath, section_start_marker, section_end_marker):
    """
    A generalized helper function to replace a section in an HTML file.

    It reads new content from a template, identifies a section in the
    target HTML file using start and end markers, and replaces that
    section's content. Temporary markers are used for precise replacement.
    """

    temp_open_marker = "2222"

    temp_close_marker = "2222"

    try:
        with open(content_template_filepath, 'r') as template_file:
            new_content_for_section = template_file.read()
    except FileNotFoundError:
        print(f"Error: Template file not found at {content_template_filepath}")
        return
    except IOError as e:
        print(f"Error reading template file {content_template_filepath}: {e}")
        return

    try:
        with open(htmlFilePath, 'r') as html_file_to_read:
            current_html_content = html_file_to_read.read()
    except FileNotFoundError:
        print(f"Error: Target HTML file not found at {htmlFilePath}")
        return
    except IOError as e:
        print(f"Error reading target HTML file {htmlFilePath}: {e}")
        return

    # Make a mutable copy of the content
    modified_html_content = current_html_content

    # Step 1: Insert the temporary open marker after the main section start marker.
    # We use re.escape on the markers in case they contain special regex characters.
    modified_html_content = re.sub(
        re.escape(section_start_marker),
        section_start_marker + temp_open_marker,
        # The markers themselves are not escaped here, as they are literal additions
        modified_html_content,
        flags=re.DOTALL
    )

    # Step 2: Insert the temporary close marker before the main section end marker.
    modified_html_content = re.sub(
        re.escape(section_end_marker),
        temp_close_marker + section_end_marker,  # The markers themselves are not escaped here
        modified_html_content,
        flags=re.DOTALL
    )

    # Step 3: Replace the content between the temporary markers.
    # Using re.escape for temp_open_marker and temp_close_marker is good practice,
    # though for "22222" and "44444" it's not strictly necessary.
    # Using r".*?" for a non-greedy match between the temp markers.
    replacement_pattern = re.escape(temp_open_marker) + r".*?" + re.escape(temp_close_marker)
    modified_html_content = re.sub(
        replacement_pattern,
        new_content_for_section,
        modified_html_content,
        flags=re.DOTALL
    )

    try:
        with open(htmlFilePath, "w") as file_writer:
            file_writer.write(modified_html_content)
    except IOError as e:
        print(f"Error writing to target HTML file {htmlFilePath}: {e}")
