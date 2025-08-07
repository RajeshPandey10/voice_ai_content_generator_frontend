// Developer utilities
export const isDeveloper = (user) => {
  return user?.email === "imrajesh2005@gmail.com";
};

export const getDeveloperInfo = (user) => {
  if (!isDeveloper(user)) return null;

  return {
    isDeveloper: true,
    badge: "DEV",
    title: "Developer - Unlimited Access",
    description: "You have unlimited access to all premium features",
    plan: "Developer Edition",
  };
};
