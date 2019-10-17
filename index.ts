/**
 * Created by user on 2017/12/14/014.
 */

import { ITsconfig } from '@ts-type/package-dts/tsconfig-json';
// @ts-ignore
import { ModuleKind, transpileModule } from 'typescript';
// @ts-ignore
import findUp from 'find-up';
// @ts-ignore
import pkgDir from 'pkg-dir';
import { existsSync, readFileSync } from 'fs';
import { isAbsolute as pathIsAbsolute, join as pathJoin } from 'path';
import * as util from 'util';
import { runInContext, createContext, isContext } from 'vm';
import JSON5 from 'json5';
//import * as deepmerge from 'deepmerge';
import deepmerge from 'lodash/merge';

export let TSCONFIG_FILENAME = 'tsconfig.json';
export let defaultTranspileOptions: ITsconfig = {
	compilerOptions: {
		module: ModuleKind.CommonJS,
		newLine: "LF",
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
export let _require = function <T = any>(path: string): T
{
	//return require(path);
	return JSON5.parse(readFileSync(path).toString());
};

// @ts-ignore
export function search_tsconfig(cwd: string = process.cwd()): string
{
	if (!pathIsAbsolute(cwd))
	{
		// @ts-ignore
		cwd = pathJoin(process.cwd(), cwd);
	}

	let ret = pathJoin(cwd, TSCONFIG_FILENAME);

	if (existsSync(ret))
	{
		return ret;
	}

	if (ret = findUp.sync(TSCONFIG_FILENAME, {
			cwd: cwd,
		}))
	{
		return ret;
	}

	ret = pathJoin(pkgDir.sync(cwd), TSCONFIG_FILENAME);

	if (existsSync(ret))
	{
		return ret;
	}

	return null;
}

export function tsOptions(transpileOptions?, ...argv): ITsconfig
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

	return deepmerge([
		{
			newLine: "lf",
		}, transpileOptions
	].concat(argv));
}

export function transpile(code, transpileOptions?): string
{
	transpileOptions = tsOptions(transpileOptions);

	//console.log(transpileOptions);

	let r = transpileModule(code, transpileOptions);

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

export function tseval<T = any>(code, context?, transpileOptions?): T
{
	console.warn(`tseval: this function is not work, pls use eval(transpile(code))`)

	//console.log(arguments.callee);
	//console.log(arguments.callee.caller);
	//console.log(arguments.caller);
	console.log(arguments.callee.caller);

	code = transpile(code, transpileOptions);

	return runInContext(code, createContext(context || arguments.callee.caller))

	//return eval.call(context || arguments.callee.caller, code)
	//return eval(transpile(code, transpileOptions));
}

export function evalSandbox<T = any>(code, sandbox?, transpileOptions?): T
{
	code = transpile(code, transpileOptions);

	return runInContext(code, isContext(sandbox) ? sandbox : createContext(sandbox));
}

const tsEval = exports as typeof import('./index');
export { tsEval };
export default exports as typeof import('./index');
