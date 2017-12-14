# ts-eval

> eval(transpile(tscode)) function evaluates TypeScript code.

`npm i ts-eval`

### demo

```javascript
const tsEval = require("ts-eval");
import tsEval from 'ts-eval';
import { tsEval } from 'ts-eval';
import * as tsEval from 'ts-eval';
```

```javascript
console.log(eval(transpileEval(`/**
 * Created by user on 2017/12/14/014.
 */
import * as path from 'path';path;/**
 * Created by user on 2017/12/14/014.
 */`)));
```

```javascript
console.log(evalSandbox(`/**
 * Created by user on 2017/12/14/014.
 */
import * as path from 'path';path;/**
 * Created by user on 2017/12/14/014.
 */`));
```

### fail note

i can't make this work see [index.ts](index.ts)

```javascript
var context = 'outside';

let self = this;

(async () =>
{
	let r;

	console.log(r = await search_tsconfig('../vue-i18next'));

	var context = 'inside';

	this.context = 'inside 2';

	console.log(tseval(transpile(`context`), this));

})();
```
