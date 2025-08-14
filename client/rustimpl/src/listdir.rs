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