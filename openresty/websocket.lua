--- Small utility for websockets
local server = require "resty.websocket.server"

local function abort(msg, ...)
  ngx.log(ngx.ERR, msg, ...)
  return ngx.exit(444)
end

local function run(handle)
  local ws, err = server:new { timeout = 10000, max_payload_len = 65535 }
  if not ws then return abort("Failed to create websocket: ", err) end

  ws.open = true
  local need_ping = false
  while ws.open do
    local data, typ, err = ws:recv_frame()
    if ws.fatal then
      return abort("Failed to receive frame: ", err)
    elseif not data then
      -- If we've had a timeout when reading, we either request a ping, or error
      -- if we've already sent a ping and not had a pong.
      if need_ping then break end

      need_ping = true
      local ok, err = ws:send_ping()
      if not ok then return abort("Cannot send ping: ", err) end

    elseif typ == "close" then
      break

    elseif typ == "ping" then
      local ok, err = ws:send_pong()
      if not ok then return abort("Cannot send pong: ", err) end

    elseif typ == "pong" then
      need_ping = false

    elseif typ == "binary" or typ == "text" then
      local ok, err = handle(ws, data, typ)
      if not ok then return abort("Cannot run handler: ", err) end

    elseif typ == "close" then
      break
    end
  end

  ws:send_close(1000, "close")
end

return run
