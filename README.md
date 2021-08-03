# mutt-fetch-bone

Tool that hits InMobi's services to pull down an ad response for debugging/tooling purposes.
This project integrates with VSCode/AZ Functions - you're free to use it if you like.

## Prerequisites: 
- Node.js v14.11.0 (or later)
- Visual Studio Code (on a supported platfor,m)
- VSCode Azure Functions plugin: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions
- Azure account with an active subscription
- A working internet connection (hah!)

## Mandatory Reading if you don't know AZ functions:
- https://docs.microsoft.com/en-us/azure/developer/javascript/how-to/develop-serverless-apps
- https://docs.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-node
- https://docs.microsoft.com/en-us/azure/azure-functions/functions-develop-vs-code?tabs=csharp 

## Installation

### Step 1:

Clone the repository and CD into it.

```
git clone https://github.com/foreza/mutt-fetch-bone.git
cd mutt-fetch-bone/
```

### Step 2: 

Run `npm i` to install all dependencies (locally).
Azure will install these dependencies.

### Step 3:

Do your thing and test locally.
The project is set up already with the folder hiearchy expected by AZ Functions.
Follow their guide to sign in to Azure if you haven't already.

### Step 4:

Once your function is uploaded, go wild.


## Usage

### Supported commands


| Command        | Description                                                 | Params             | Example Usage                                                                   |
|----------------|-------------------------------------------------------------|--------------------|---------------------------------------------------------------------------------|
| `GenerateAdOpsTemplate`          | Generates a macro template for the adops tool, with $REPLACE_VAST_TARGET for your VAST               | N/A                | `http://localhost:7071/api/GenerateAdOpsTemplate`                                                                |
| `GenerateMuttResponseFromVastTag` | Generates a rewritable/local mappable template for testing provided a URI | URI of target VAST | `http://localhost:7071/api/GenerateMuttResponseFromVastTag?uri=https://jasonthechiu.com/SESUPPLY-TESTADS/ias-test-dog-vast` |

### Output:

A JSON response. Save it and use it to local map.


## TODO:
- Remove all the UI stuff after I've saved it elsewhere.
- Cleanup
- Make it accessible provided you have a provide api_key that I grant