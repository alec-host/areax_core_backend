module.exports.isMessageAccepted = (payload) => {
  if (typeof payload === 'object' && Array.isArray(payload?.messages)) {
    for (const message of payload.messages) {
      if (message.message_status === 'accepted') {
        return true;
      }
    }
  }
  return false;
};
