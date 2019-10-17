/**
 * Created by user on 2019/10/18.
 */

import tsEval from '..';

console.log(eval(tsEval.transpileEval(`/**
 * Created by user on 2017/12/14/014.
 */
import * as path from 'path';path;/**
 * Created by user on 2017/12/14/014.
 */`)));
