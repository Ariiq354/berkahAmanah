export default eventHandler(async (event) => {
  protectFunction(event);

  await invalidateSession(event.context.session!.id);
  deleteSessionTokenCookie(event);
});
