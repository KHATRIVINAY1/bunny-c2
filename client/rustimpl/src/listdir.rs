use std::fs;
use std::path::Path;
use crate::Response;

pub fn list_dir(path :&str) ->(String, String){
    let mut status = String::from("Success");
    let mut response = String::new();
    match fs::read_dir(path){
        Ok(entries)=>{
            for entry in entries{
                if let Ok(entry) = entry{
                    let path = entry.path();
                    if path.is_dir() {
                        response.push_str(format!("{}\n", path.display()).as_str());
                    } else {
                        response.push_str(format!("{}\n", path.display()).as_str());
                    }
                }
            }
        }
        Err(e) => {
            status = "Error[X]".to_string();
            response.push_str(format!("Error reading directory: {}", e).as_str());
        }
    }

    return (response,status);
}


pub fn list_dir_travel(path: &str) -> (String, String) {
    let mut data = String::from("{\"items\":[");
    let mut first = true;
    let mut message = String::from("Success");

    // Special case: list drives if path = "."
    if path == "." {
        {
            for drive in b'A'..=b'Z' {
                let drive_letter = format!("{}:\\", drive as char);
                if Path::new(&drive_letter).exists() {
                    if !first {
                        data.push(',');
                    }
                    first = false;
                    data.push_str(&format!(
                        "{{\"name\":\"{}\",\"path\":\"{}\",\"entry_type\":\"drive\"}}",
                        drive_letter, drive_letter
                    ));
                }
            }
        }

        data.push_str("]}");
        data = data.replace("\\", "\\\\");
        message= data.clone();
        
        return (data, message);
    }

    // Normal directory listing
    match fs::read_dir(path) {
        Ok(entries) => {
            for entry in entries {
                if let Ok(entry) = entry {
                    let path_buf = entry.path();
                    let file_name = entry.file_name().to_string_lossy().to_string();
                    let entry_type = if path_buf.is_dir() { "directory" } else { "file" };

                    if !first {
                        data.push(',');
                    }
                    first = false;

                    data.push_str(&format!(
                        "{{\"name\":\"{}\",\"path\":\"{}\",\"entry_type\":\"{}\"}}",
                        file_name,
                        path_buf.display(),
                        entry_type
                    ));
                }
            }
        }
        Err(e) => {
            message = format!("Error: {}", e);
        }
    }

    data.push_str("]}");
    data = data.replace("\\", "\\\\");
    message= data.clone();
    (data, message)
}