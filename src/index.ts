import { debug, getInput, setOutput, setFailed } from '@actions/core';
import { readFileSync, writeFileSync } from 'fs';
import { isAbsolute, join } from 'path';
import { fileSync } from 'tmp';
import { ECS } from 'aws-sdk';
import { Env } from './types';

async function run(): Promise<void> {
  try {
    debug('START ADDING VARIABLES');
    const taskPathValue: string = getInput('task-definition');
    const taskDefPath = isAbsolute(taskPathValue)
      ? taskPathValue
      : join(process.env.GITHUB_WORKSPACE || __dirname, taskPathValue);
    debug(taskDefPath);
    const taskContent = readFileSync(taskDefPath).toString();
    debug(taskContent);
    // const taskDef: ECS.TaskDefinition = JSON.parse(taskContent);
    // debug(JSON.stringify(taskDef));

    // if (!taskDef.containerDefinitions) {
    //   throw new Error('The task does not have any containers defined...');
    // }

    // const containerName: string = getInput('container-name');
    // const containerIndex = taskDef.containerDefinitions
    //   .findIndex(({ name }) => name === containerName)

    // if (containerIndex === undefined) {
    //   throw new Error(`Container ${containerName} is not found in the task definition...`);
    // }

    // const envVars: Env = JSON.parse(getInput('env-variables'));

    // taskDef.containerDefinitions[containerIndex].environment = [
    //   ...(taskDef.containerDefinitions[containerIndex].environment || []),
    //   ...Object.keys(envVars).map((name) => ({ name, value: envVars[name] }))
    // ];

    // debug(taskDef.toString());

    // const updatedTaskDefFile = fileSync({
    //   tmpdir: process.env.RUNNER_TEMP,
    //   prefix: 'task-definition-',
    //   postfix: '.json',
    //   keep: true,
    //   discardDescriptor: true
    // });

    // const newTaskDefContent = JSON.stringify(taskDef, null, 2);
    // writeFileSync(updatedTaskDefFile.name, newTaskDefContent);
    // setOutput('task-definition', updatedTaskDefFile.name);
  } catch (error) {
    setFailed(error.message);
    debug(error.stack);
  }
}

run();
