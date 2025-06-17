#!/usr/bin/env python3

import sys
from utility import update_html_section  # Import the function

htmlFilePath = None  # Initialize to None

if len(sys.argv) > 1:

    htmlFilePath = sys.argv[1]

    print(f"target HTML file path: '{htmlFilePath}'")

else:

    print("No HTML file path provided as a command-line argument.")

    print(f"Usage: ./templater.py <path_to_html_file>")

    sys.exit(1)

def update_section_css_includes():

    markerBegin = "<!-- html / including / styling / begin -->"

    markerEnd = "<!-- html / including / styling / end -->"

    templateFilePath = 'templates/html-includes-styling.template'

    update_html_section(htmlFilePath, templateFilePath, markerBegin, markerEnd)

def update_section_js_includes():

    markerBegin = "<!-- html / including / scripting / begin -->"

    markerEnd = "<!-- html / including / scripting / end -->"

    templateFilePath = 'templates/html-includes-scripting.template'

    update_html_section(htmlFilePath, templateFilePath, markerBegin, markerEnd)

def update_section_desktop_sidebar():

    markerBegin = "<!-- html / sidebar / desktop / begin -->"

    markerEnd = "<!-- html / sidebar / desktop / end -->"

    templateFilePath ='templates/navigation-sidebar-desktop.template'

    update_html_section(htmlFilePath, templateFilePath, markerBegin, markerEnd)

def update_section_mobile_sidebar():

    markerBegin = "<!-- html / sidebar / mobile / begin -->"

    markerEnd = "<!-- html / sidebar / mobile / end -->"

    templateFilePath ='templates/navigation-sidebar-mobile.template'

    update_html_section(htmlFilePath, templateFilePath, markerBegin, markerEnd)

###################################################################
##
## driver
##
###################################################################

update_section_css_includes()

update_section_js_includes()

update_section_desktop_sidebar()

#update_section_mobile_sidebar()
