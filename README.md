# mutt-fetch-bone
Tool that hits InMobi's services to pull down an ad response for debugging/tooling purposes.

## Prerequisites: 
- Node.js v14.11.0 (or later)
- A working internet connection (hah!)

## Installation

### Step 1:

Clone the repository and CD into it.

```
git clone https://github.com/foreza/mutt-fetch-bone.git
cd mutt-fetch-bone/
```

### Step 2: 

Run `npm i` to install all dependencies.

You're all set. 


## Usage

### Supported commands


| Command        | Description                                                 | Params             | Example Usage                                                                   |
|----------------|-------------------------------------------------------------|--------------------|---------------------------------------------------------------------------------|
| `adops`          | Generates a macro template for the adops tool               | N/A                | `node fetch adops`                                                                |
| `replaceFromURI` | Generates a rewritable/local mappable template for testing. | URI of target VAST | `node replaceFromURI https://jasonthechiu.com/SESUPPLY-TESTADS/ias-test-dog-vast` |

### Output:

All files will be output into the `output` directory.

## TODO:
