// import React from "react";

// const ItemCard = ({ item, type }) => {
//   return (
//     <div className="item-card">
//       <div className="card-header">
//         <div>
//           <h3>{item.name}</h3>
//           <p>{type === "application" ? `Applied on: ${item.date}` : `Price: $${item.price}`}</p>
//         </div>
//         <div className="actions">
//           {type === "application" ? (
//             <>
//               <button className="view">View Details</button>
//               <button className="shortlist">Shortlist</button>
//               <button className="reject">Reject</button>
//             </>
//           ) : (
//             <button className="remove">Remove</button>
//           )}
//         </div>
//       </div>
//       {type === "application" ? (
//         <>
//           <p>Experience: {item.experience}</p>
//           <p>Skills: {item.skills}</p>
//         </>
//       ) : (
//         <p>Quantity: {item.quantity}</p>
//       )}
//     </div>
//   );
// };

// export default ItemCard;