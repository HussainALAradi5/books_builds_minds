import "../styles/card.css";

const Card = ({ type, data }) => {
  return (
    <div className="card">
      {type === "user" && (
        <>
          {data.avatar && (
            <img className="avatar" src={data.avatar} alt={data.username} />
          )}
          <h3>{data.username}</h3>
          <p>Email: {data.email}</p>
          <p>Password: {data.password}</p>
          <p>Status: {data.status}</p>
        </>
      )}

      {type === "book" && (
        <>
          <h3>{data.title}</h3>
          {data.image && (
            <img
              className="cover"
              src={data.image}
              alt={data.title}
            />
          )}
          <p>Author: {data.author}</p>
          <p>Publisher: {data.publisher}</p>
        </>
      )}
    </div>
  );
};

export default Card;