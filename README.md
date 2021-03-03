# amazon-ecs-task-environment

Github Action adding environment variables to a ECS task definition on fly

## Usage

```yaml
- name: Add environment variables to ECS task definition
  uses: cvmaker-bv/amazon-ecs-task-environment@v1
  env:
    MY_VAR: my-value
  with:
    task-definition: "path/to/task-def.json"
    container-name: "ecs-container"
    env-variables: "${{ toJson(env) }}"
```

And with other AWS actions like this:

```yaml
- name: Login to Amazon ECR
  id: login-ecr
  uses: aws-actions/amazon-ecr-login@v1
- name: Render Amazon ECS task definition
  id: render-web-container
  uses: aws-actions/amazon-ecs-render-task-definition@v1
  with:
    task-definition: "path/to/task-def.json"
    container-name: "ecs-container"
    image: "${{ steps.login-ecr.outputs.registry }}/${{ ECR_REPO }}:${{ github.sha }}"
- name: Add environment variables to ECS task definition
  id: add-env-var
  uses: cvmaker-bv/amazon-ecs-task-environment@v1
  env:
    MY_VAR: my-value
  with:
    task-definition: ${{ steps.render-web-container.outputs.task-definition }}
    container-name: "ecs-container"
    env-variables: "${{ toJson(env) }}"
- name: Deploy to Amazon ECS service
  uses: aws-actions/amazon-ecs-deploy-task-definition@v1
  with:
    task-definition: ${{ steps.add-env-var.outputs.task-definition }}
    service: "gateway-service-${{ env.ENVIRONMENT }}"
    cluster: "cluster-${{ env.ENVIRONMENT }}"
```
