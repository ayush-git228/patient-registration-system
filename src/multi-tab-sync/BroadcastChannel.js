import { useEffect, useRef } from "react";

 // Custom React hook for BroadcastChannel API.
export default function useBroadcastChannel(channelName, onMessage) { // onMessage - Handler for incoming messages.
  const channelRef = useRef(null);

  useEffect(() => {
    // Create channel
    const channel = new BroadcastChannel(channelName);
    channelRef.current = channel;

    // Listening to messages
    channel.onmessage = onMessage;

    return () => {     // Cleanup on unmount
      channel.close();    
    };
  }, [channelName, onMessage]);

  // function returned to post messages
  return (msg) => {
    if (channelRef.current) {
      channelRef.current.postMessage(msg);
    }
  };
}
