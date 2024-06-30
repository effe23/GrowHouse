import os

# List of files to extract
files_to_extract = [
    'app/layout.tsx',
    'app/page.tsx',
    'app/globals.css',
    'app/components/Footer.tsx',
    'app/components/Navbar.tsx',
    'app/components/PlantDetails.tsx',
    'app/components/PlantGrid.tsx',
    'app/components/LineChart.tsx',
    'pages/api/control-led.ts',
    'pages/api/control-pump.ts',
    'pages/api/sensor-data.ts',
    'pages/api/send-email.ts',
    'README-2.md',
    'project_structure.txt',
]





# Output file
output_file = 'project_files.txt'

def extract_files(files, output):
    with open(output, 'w') as outfile:
        for file_path in files:
            if os.path.exists(file_path):
                with open(file_path, 'r') as infile:
                    outfile.write(f'--- {file_path} ---\n')
                    outfile.write(infile.read())
                    outfile.write('\n\n')
            else:
                outfile.write(f'--- {file_path} ---\n')
                outfile.write('File not found.\n\n')

if __name__ == "__main__":
    extract_files(files_to_extract, output_file)
    print(f'Files have been extracted to {output_file}')
