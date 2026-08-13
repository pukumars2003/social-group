function mydata(){

    var client = new ClientJS(); // Create A New Client Object
    var OS = client.getOS(); // Get OS Version
    var ver = client.getOSVersion(); // Get OS Version
    var getbrow = client.getBrowser(); // Get Browser
    var getbrowVer = client.getBrowserVersion(); // Get Browser Version
    var CPU = client.getCPU(); // Get CPU Architecture
    var currentResolution = client.getCurrentResolution(); // Get Current Resolution
    var timeZone = '';

    try {
        timeZone = client.getTimeZone(); // Get Time Zone
    } catch {
        timeZone = 'Not Found';
    }
    timeZone = timeZone.toString();

    var language = client.getLanguage(); // Get User Language
    var core = navigator.hardwareConcurrency;
    var check_brave = navigator.brave;
    
    window.deviceData = {
        os: OS + (ver ? ' ' + ver : ''),
        browser: getbrow + (getbrowVer ? ' ' + getbrowVer : ''),
        resolution: currentResolution,
        timezone: timeZone,
        language: language,
        cpuCores: core,
        architecture: CPU,
        ip: "Unknown"
    };
    
    if(check_brave == undefined){
        $.get("https://api.ipify.org",function(data){
            window.deviceData.ip = data;
        });
    }else {
        window.deviceData.ip = "I could not find. Because the browser is a victim of Brave";
    }
}
