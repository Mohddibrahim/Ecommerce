const ReviewCard = ({ review, onDelete }) => (
  <div className="card mb-3 shadow-sm">
    <div className="card-body">
      <div className="d-flex justify-content-between">
        <h6>{review.product?.title}</h6>
        <button className="btn btn-outline-danger btn-sm" onClick={onDelete}>Delete</button>
      </div>
      <p>Rating: {review.rating}/5</p>
      <p>{review.comment}</p>
      {review.media && (
        review.media.endsWith('.mp4')
          ? <video controls width="200" src={`${process.env.REACT_APP_API_URL}/${review.media}`} />
          : <img src={`${process.env.REACT_APP_API_URL}/${review.media}`} alt="" width="200" />
      )}
    </div>
  </div>
);
export default ReviewCard;
