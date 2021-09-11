# Cloudfare application to update Google Calendar

A cloudfare application to update Google Calendar with a customized app

1) Mobile Application written in ReactNative
2) NodeJS hosted in cloudflare worker node

## Backend Installation

#### Google Cloud Calendar 
1) Apply a Google Cloud Account
2) Create OAuth Consent Screen
3) Create OAuth Client ID / Secret

#### Cloudflare Wrangler
1) Generate using [wrangler](https://github.com/cloudflare/wrangler)
```
wrangler generate projectname

wrangler kv:namespace create "FILES"
wrangler kv:namespace create "FILES" --preview
wrangler kv:namespace create "CRENDENTIALS"
wrangler kv:namespace create "CRENDENTIALS" --preview
```


## Tips : Command to Sync access token between environment
```
wrangler kv:key get -n 4bc7c278299a44109aa9fe514a750c01 "access-<EMAIL>" | pbcopy
wrangler kv:key put -n 4e428f44343849d39c0b044cf59ea960 "access-<EMAIL>" "`pbpaste`"

wrangler kv:key get -n 4bc7c278299a44109aa9fe514a750c01 "refresh-<EMAIL>" | pbcopy
wrangler kv:key put -n 4e428f44343849d39c0b044cf59ea960 "refresh-<EMAIL>" "`pbpaste`"
```

Further documentation for Wrangler can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler).

## Mobile Application Installation
1) TBD