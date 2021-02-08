const Errors = {
  PROJECT_MANAGER_NOT_FOUND: {
    projectManagerNotFound: 'Project manager not found',
  },
};

module.exports = {
  inputs: {
    id: {
      type: 'string',
      regex: /^[0-9]+$/,
      required: true,
    },
  },

  exits: {
    projectManagerNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    let projectManager = await ProjectManager.findOne(inputs.id);

    if (!projectManager) {
      throw Errors.PROJECT_MANAGER_NOT_FOUND;
    }

    const isProjectManager = await sails.helpers.users.isProjectManager(
      currentUser.id,
      projectManager.projectId,
    );

    if (!isProjectManager) {
      throw Errors.PROJECT_MANAGER_NOT_FOUND; // Forbidden
    }

    projectManager = await sails.helpers.projectManagers.deleteOne(projectManager, this.req);

    if (!projectManager) {
      throw Errors.PROJECT_MANAGER_NOT_FOUND;
    }

    return {
      item: projectManager,
    };
  },
};
