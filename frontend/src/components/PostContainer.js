import React from 'react';

function PostContainer({ index, item }) {
	return (
		<div className='bg-[#2a2b2d] rounded-lg w-11/12 m-5 flex p-5 md:flex-row flex-col md:items-start items-center drop-shadow-lg"'>
			<img src={item?.image} alt="homePageSkeleton" className="w-64 rounded-lg mr-5 mb-3 md:mb-0" />
			<div>
				<div className="md:text-3xl text-2xl font-bold mb-5">{item?.title}</div>
				<div className="flex ">
					<div className="md:text-2xl text-lg font-bold mr-2">₹{item?.source_price}</div>
					<div className="md:text-2xl text-lg font-medium mr-2 line-through">₹{item.source_mrp}</div>
					<div className="md:text-2xl text-lg font-bold mr-2 text-lime-400">{item.discount}% OFF</div>
				</div>
			</div>
		</div>
	);
}

export default PostContainer;
