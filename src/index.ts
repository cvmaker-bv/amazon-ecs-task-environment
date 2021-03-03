import { debug, getInput, setOutput, setFailed } from '@actions/core';
import { readFileSync, writeFileSync } from 'fs';
import { fileSync } from 'tmp';
import { ECS } from 'aws-sdk';
import { Env } from './types';

async function run(): Promise<void> {
  try {
    const taskPath: string = getInput('task-definition');
    const taskDef: ECS.TaskDefinition = JSON.parse(readFileSync(taskPath).toString());
    debug(JSON.stringify(taskDef));

    if (!taskDef.containerDefinitions) {
      throw new Error('The task does not have any containers defined...');
    }

    const containerName: string = getInput('container-name');
    const containerIndex = taskDef.containerDefinitions
      .findIndex(({ name }) => name === containerName)

    if (containerIndex === undefined) {
      throw new Error(`Container ${containerName} is not found in the task definition...`);
    }

    const env: Env = JSON.parse(getInput('container-name'));

    taskDef.containerDefinitions[containerIndex].environment = [
      ...(taskDef.containerDefinitions[containerIndex].environment || []),
      ...Object.keys(env).map((name) => ({ name, value: env[name] }))
    ];

    debug(taskDef.toString());

    const updatedTaskDefFile = fileSync({
      tmpdir: process.env.RUNNER_TEMP,
      prefix: 'task-definition-',
      postfix: '.json',
      keep: true,
      discardDescriptor: true
    });

    const newTaskDefContent = JSON.stringify(taskDef, null, 2);
    writeFileSync(updatedTaskDefFile.name, newTaskDefContent);
    setOutput('task-definition', updatedTaskDefFile.name);
  } catch (error) {
    setFailed(error.message);
    debug(error.stack);
  }
}

run();
