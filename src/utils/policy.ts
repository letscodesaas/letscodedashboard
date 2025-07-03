export const teamsPolicy = (policy: string) => {
  if (policy == '0') {
    return {
      title: 'teams',
      access: false,
      resources: [],
      link:[]
    };
  }
  if (policy == '1') {
    return {
      title: 'teams',
      access: true,
      resources: ['Manage'],
      link: ['/dashboard/team/manage'],
    };
  }

  if (policy == '2') {
    return {
      title: 'teams',
      access: true,
      resources: ['Manage', 'Create'],
      link: ['/dashboard/team/manage', 'dashboard/team/create'],
    };
  }
};

export const jobsPolicy = (policy: string) => {
  if (policy == '0') {
    return {
      title: 'jobs',
      access: false,
      resources: [],
      link:[]
    };
  }
  if (policy == '1') {
    return {
      title: 'jobs',
      access: true,
      resources: ['Manage'],
      link: ['/dashboard/jobs/show'],
    };
  }

  if (policy == '2') {
    return {
      title: 'jobs',
      access: true,
      resources: ['Manage', 'Create'],
      link: ['/dashboard/jobs/show', '/dashboard/jobs/create'],
    };
  }
};

export const productsPolicy = (policy: string) => {
  if (policy == '0') {
    return {
      title: 'products',
      access: false,
      resources: [],
      link:[]
    };
  }
  if (policy == '1') {
    return {
      title: 'products',
      access: true,
      resources: ['Manage'],
      link: ['/dashboard/product/show'],
    };
  }

  if (policy == '2') {
    return {
      title: 'products',
      access: true,
      resources: ['Manage', 'Create'],
      link: ['/dashboard/product/show', '/dashboard/product/create'],
    };
  }
};

export const newslettersPolicy = (policy: string) => {
  if (policy == '0') {
    return {
      title: 'newsletters',
      access: false,
      resources: [],
      link:[]
    };
  }
  if (policy == '1') {
    return {
      title: 'newsletters',
      access: true,
      resources: ['Manage'],
      link: ['/published'],
    };
  }

  if (policy == '2') {
    return {
      title: 'newsletters',
      access: true,
      resources: ['Manage', 'Create'],
      link: ['/published', '/dashboard/newsletter'],
    };
  }
};
