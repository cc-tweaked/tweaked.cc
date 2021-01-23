# tweaked.cc 
This repository contains miscellaneous bit of configuration for [tweaked.cc]
(and other CC: Tweaked related infrastructure that I maintain). This does _not_
contain the actual documentation, styling or any other content. That can be
found [in the main CC: Tweaked repository][cct].

This largely exists for intellectual curiosity - there's probably not much here
that can be contributed to.

## Contents
 - `cors-proxy/`: This is a lightweight CORS proxy which runs in a CloudFlare
   worker. HTTP requests made from copy-cat (and thus the tweaked.cc emulator)
   go through this proxy.

   It only accepts requests from the CC:T and copy-cat websites, to avoid
   abuse by other websites.

 - `openresty/`: OpenResty configuration files for [tweaked.cc].

[cct]: https://github.com/SquidDev-CC/CC-Tweaked "CC: Tweaked's GitHub repository"
[tweaked.cc]: https://tweaked.cc "The CC: Tweaked website"
