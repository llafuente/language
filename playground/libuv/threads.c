uv_async_t exit_handle;

void exit_async_cb(uv_async_t* handle, int status) {
  /* After closing the async handle, it will no longer keep the loop alive. */
  uv_close((uv_handle_t*) &exit_handle, NULL);
}

void thread_function() {
  uv_loop_t *loop = uv_loop_new();
  /* The existence of the async handle will keep the loop alive. */
  uv_async_init(loop, &exit_handle, exit_async_cb);
  uv_run(loop);
}
