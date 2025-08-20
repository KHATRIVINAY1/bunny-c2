use sysinfo::{ System};
use serde::Serialize;


fn list_processes() -> String {
    let mut sys = System::new_all();
    sys.refresh_all();
    let mut processes = String::new();
    for process in sys.processes() {
        processes.push_str(&format!("{}: {} \n", process.0, process.1.name()));
    }
    processes
}


#[derive(Debug, Serialize)]
pub struct BasicInfo{
        name: String,
        os: String,
        process:String,
        // ip  : String::from("0.0.0.0"),
        arch: String,
        admin: bool,
        version: String,
    }
#[cfg(target_os = "windows")]
pub fn is_elevated() -> bool {
    use std::ptr;
    use winapi::um::processthreadsapi::{OpenProcessToken, GetCurrentProcess};
    use winapi::um::securitybaseapi::GetTokenInformation;
    use winapi::um::winnt::{TokenElevation, HANDLE, TOKEN_QUERY, TOKEN_ELEVATION};

    unsafe {
        let mut token: HANDLE = ptr::null_mut();
        if OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &mut token) == 0 {
            return false;
        }
        let mut elevation = TOKEN_ELEVATION { TokenIsElevated: 0 };
        let mut ret_len = 0;
        let res = GetTokenInformation(
            token,
            TokenElevation,
            &mut elevation as *mut _ as *mut _,
            std::mem::size_of::<TOKEN_ELEVATION>() as u32,
            &mut ret_len,
        );
        elevation.TokenIsElevated != 0 && res != 0
    }
}

pub fn basic_info() ->BasicInfo{
        let username = whoami::username();
        let realname = whoami::realname();
        let os = whoami::devicename();
        let hostname = whoami::hostname();
        let platform= whoami::platform();
        let distro =whoami::distro();
        let arch = whoami::arch();
        let version = whoami::desktop_env();
        let mut admin = false;

        if is_elevated() {
            admin = true;
        }

        let info = BasicInfo {
                        name: format!("{}/({})", username, hostname),
                        version: format!("{} {}", os, platform),
                        os: format!("{}", distro),
                        arch : format!("{}", arch),
                        admin: admin,
                        process:list_processes()
                };
        


        info

}