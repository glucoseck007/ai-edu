function UserMessage({ text }: { text: string }) {
  return (
    <div className="message-container">
      <div className="user-message">{text}</div>
    </div>
  );
}

export default UserMessage;
