use std::process::Command;
use std::io::{self, Write};

pub fn execute_cmd_command(command: &str) -> (String, String) {
    // Check if we're on Windows and handle shell commands appropriately
    if cfg!(target_os = "windows") {
        // For Windows, use cmd.exe to execute the command
        let output = match Command::new("cmd")
            .args(&["/C", command])
            .output() 
        {
            Ok(output) => output,
            Err(e) => {
                return ("Error".to_string(), format!("Failed to execute command: {}", e));
            }
        };
        
        // Convert stdout and stderr to Strings
        let stdout = String::from_utf8(output.stdout)
            .unwrap_or_else(|_| "Invalid UTF-8 in stdout".to_string());
        
        let stderr = String::from_utf8(output.stderr)
            .unwrap_or_else(|_| "Invalid UTF-8 in stderr".to_string());
        
        // Check if the command executed successfully
        if !output.status.success() {
            return ("Error".to_string(), format!("Command failed with exit code {}: {}",
                output.status.code().unwrap_or(-1),
                stderr));
        }
        
        (stdout, stderr)
    } else {
        // For Unix-like systems, use the original approach
        let parts: Vec<&str> = command.split_whitespace().collect();
        
        if parts.is_empty() {
            return ("Error".to_string(), "Empty command".to_string());
        }
        
        let (cmd, args) = parts.split_first().unwrap();
        
        // Execute the command
        let output = match Command::new(cmd).args(args).output() {
            Ok(output) => output,
            Err(e) => {
                return ("Error".to_string(), format!("Failed to execute command: {}", e));
            }
        };
        
        // Convert stdout and stderr to Strings
        let stdout = String::from_utf8(output.stdout)
            .unwrap_or_else(|_| "Invalid UTF-8 in stdout".to_string());
        
        let stderr = String::from_utf8(output.stderr)
            .unwrap_or_else(|_| "Invalid UTF-8 in stderr".to_string());
        
        // Check if the command executed successfully
        if !output.status.success() {
            return ("Error".to_string(), format!("Command failed with exit code {}: {}",
                output.status.code().unwrap_or(-1),
                stderr));
        }
        
        (stdout, stderr)
    }
}
