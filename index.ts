/**
 * Created by user on 2017/12/14/014.
 */

import * as ts from 'typescript';
import * as findUp from 'find-up';
import * as pkgDir from 'pkg-dir';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as vm from 'vm';
import * as JSON5 from 'json5';
import * as deepmerge from 'deepmerge';

export let TSCONFIG_FILENAME = 'tsconfig.json';
export let defaultTranspileOptions = {
	compilerOptions: {
		module: ts.ModuleKind.CommonJS,
		newLine: "lf",
		strict: false,
	},
};

/**
 * u can replace this func at runtime
 *
 * @param path
 * @returns {*}
 * @private
 */
export function _require(path: string)
{
	//return require(path);
	return JSON5.parse(fs.readFileSync(path));
}

export function search_tsconfig(cwd: string = process.cwd()): string
{
	if (!path.isAbsolute(cwd))
	{
		cwd = path.join(process.cwd(), cwd);
	}

	let ret = path.join(cwd, TSCONFIG_FILENAME);

	if (fs.existsSync(ret))
	{
		return ret;
	}

	if (ret = findUp.sync(TSCONFIG_FILENAME, {
			cwd: cwd,
		}))
	{
		return ret;
	}

	ret = path.join(pkgDir.sync(cwd), TSCONFIG_FILENAME);

	if (fs.existsSync(ret))
	{
		return ret;
	}

	return null;
}

export function tsOptions(transpileOptions?, ...argv)
{
	if (!transpileOptions)
	{
		transpileOptions = search_tsconfig();
	}

	if (typeof transpileOptions == 'string')
	{
		transpileOptions = _require(transpileOptions);
	}

	if (!transpileOptions)
	{
		transpileOptions = defaultTranspileOptions;
	}

	//console.log(transpileOptions);

	return deepmerge.all([
		{
			newLine: "lf",
		}, transpileOptions
	].concat(argv));
}

export function transpile(code, transpileOptions?): string
{
	transpileOptions = tsOptions(transpileOptions);

	//console.log(transpileOptions);

	let r = ts.transpileModule(code, transpileOptions);

	//console.log(r.outputText);

	return r.outputText;
}

export function transpileEval(code, transpileOptions?): string
{
	transpileOptions = tsOptions(transpileOptions, {
		"removeComments": true,
	});

	code = transpile(code, transpileOptions);

	code = code
		.replace(/^\s*("use strict";|'use strict';)?\s*(?:exports\.__esModule = true;|Object\.defineProperty\(exports, "__esModule", \{ value: true \}\);)/, "$1\n")
	;

	//console.log(code);

	return code;
}

export function tseval(code, context?, transpileOptions?)
{
	console.warn(`tseval: this function is not work, pls use eval(transpile(code))`)

	//console.log(arguments.callee);
	//console.log(arguments.callee.caller);
	//console.log(arguments.caller);
	console.log(arguments.callee.caller);

	code = transpile(code, transpileOptions);

	return vm.runInContext(code, vm.createContext(context || arguments.callee.caller))

	//return eval.call(context || arguments.callee.caller, code)
	//return eval(transpile(code, transpileOptions));
}

export function evalSandbox(code, sandbox?, transpileOptions?)
{
	code = transpile(code, transpileOptions);

	return vm.runInContext(code, vm.isContext(sandbox) ? sandbox : vm.createContext(sandbox));
}

// @ts-ignore
export const tsEval = exports;
// @ts-ignore
export default exports;
