const useRuLabels = () => {
  const bookingStatusMap = {
    pending: "\u0412 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u0438",
    approved: "\u041E\u0434\u043E\u0431\u0440\u0435\u043D\u043E",
    rejected: "\u041E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u043E",
    cancelled: "\u041E\u0442\u043C\u0435\u043D\u0435\u043D\u043E",
    arrived: "\u041F\u0440\u0438\u0431\u044B\u043B",
    left: "\u0412\u044B\u0435\u0445\u0430\u043B",
    completed: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E"
  };
  const roleMap = {
    admin: "\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440",
    guard: "\u041E\u0445\u0440\u0430\u043D\u0430",
    tenant: "\u0410\u0440\u0435\u043D\u0434\u0430\u0442\u043E\u0440"
  };
  const actionMap = {
    INSERT: "\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435",
    UPDATE: "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435",
    DELETE: "\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435"
  };
  const tableMap = {
    bookings: "\u0411\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F",
    zones: "\u0417\u043E\u043D\u044B",
    profiles: "\u041F\u0440\u043E\u0444\u0438\u043B\u0438",
    settings: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
    notifications: "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F",
    closures: "\u041E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u044F"
  };
  const bookingStatusLabel = (value) => {
    if (!value) {
      return "";
    }
    return bookingStatusMap[value] || value;
  };
  const roleLabel = (value) => {
    if (!value) {
      return "";
    }
    return roleMap[value] || value;
  };
  const actionLabel = (value) => {
    if (!value) {
      return "";
    }
    return actionMap[value] || value;
  };
  const tableLabel = (value) => {
    if (!value) {
      return "";
    }
    return tableMap[value] || value;
  };
  return {
    bookingStatusLabel,
    roleLabel,
    actionLabel,
    tableLabel
  };
};

export { useRuLabels as u };
//# sourceMappingURL=useRuLabels-B4xkMTP6.mjs.map
