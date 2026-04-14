import os
import sys
from pathlib import Path
from collections import Counter

def get_size(path):
    """Return total size (in bytes) of a file or directory."""
    if os.path.isfile(path):
        return os.path.getsize(path)
    total = 0
    for root, dirs, files in os.walk(path):
        for f in files:
            fp = os.path.join(root, f)
            if os.path.exists(fp):
                total += os.path.getsize(fp)
    return total

def format_size(size_bytes):
    """Convert bytes to human readable string."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} TB"

def build_tree(path, prefix="", is_last=True, stats=None):
    """
    Recursively build a text tree representation of the directory.
    stats is a dict to collect file extension counts and total size.
    """
    if stats is None:
        stats = {"total_files": 0, "total_size": 0, "extensions": Counter()}

    # Path object for easier handling
    p = Path(path)

    # Determine the display name
    if p.is_dir():
        display_name = p.name + os.sep
        # For root directory, show full path
        if prefix == "":
            display_name = str(p) + os.sep
        tree_lines = []
        children = sorted(p.iterdir(), key=lambda x: (not x.is_dir(), x.name.lower()))
        for i, child in enumerate(children):
            is_last_child = (i == len(children) - 1)
            connector = "└── " if is_last_child else "├── "
            subtree, stats = build_tree(str(child), prefix + ("    " if is_last else "│   "), is_last_child, stats)
            tree_lines.append(connector + subtree.split("\n", 1)[0])  # first line only
            rest = subtree.split("\n", 1)[1] if "\n" in subtree else ""
            if rest:
                tree_lines.append(rest)
        if tree_lines:
            tree_str = display_name + "\n" + "\n".join(tree_lines)
        else:
            tree_str = display_name + " (empty directory)"
    else:
        # It's a file
        size = os.path.getsize(path)
        stats["total_files"] += 1
        stats["total_size"] += size
        ext = p.suffix.lower() or "(no extension)"
        stats["extensions"][ext] += 1
        tree_str = f"{p.name} ({format_size(size)})"

    # Indent for parent recursion (only used when returning from deeper calls)
    # The first line of tree_str is already the root name; subsequent lines are children.
    if prefix:
        lines = tree_str.split("\n")
        for i, line in enumerate(lines):
            if i == 0:
                lines[i] = line
            else:
                lines[i] = prefix + ("    " if is_last else "│   ") + line
        tree_str = "\n".join(lines)

    return tree_str, stats

def analyze_directory(root_path):
    """Generate full analysis report."""
    if not os.path.exists(root_path):
        return f"Error: Path '{root_path}' does not exist."

    tree, stats = build_tree(root_path)

    # Build summary
    summary = "\n" + "="*50 + "\n"
    summary += f"ANALYSIS SUMMARY for: {root_path}\n"
    summary += "="*50 + "\n"
    summary += f"Total files: {stats['total_files']}\n"
    summary += f"Total size : {format_size(stats['total_size'])}\n"
    if stats['extensions']:
        summary += "\nFile type breakdown:\n"
        for ext, count in sorted(stats['extensions'].items(), key=lambda x: -x[1]):
            summary += f"  {ext:<15} : {count} file(s)\n"
    else:
        summary += "\nNo files found.\n"

    return tree + "\n" + summary

if __name__ == "__main__":
    # Default target path – change or pass as command line argument
    target_path = r"C:\Users\abebe\Desktop\New folder\App1"
    if len(sys.argv) > 1:
        target_path = sys.argv[1]

    report = analyze_directory(target_path)
    print(report)

    # Optional: save to a text file
    output_file = "file_tree_report.txt"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"\nReport also saved to: {output_file}")