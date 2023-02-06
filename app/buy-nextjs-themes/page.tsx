export const metadata = {
	title: "Buy Next.js Themes",
	description: "Buy Next.js Themes",
};

export default function Themes() {
	return (
		<section>
			<div className='card lg:card-side bg-zinc-900 shadow-xl'>
				<figure>
					<img
						src='https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg'
						alt='Album'
					/>
				</figure>
				<div className='card-body'>
					<h2 className='card-title'>New album is released!</h2>
					<p>Click the button to listen on Spotiwhy app.</p>
					<div className='card-actions justify-end'>
						<button className='inline-flex items-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-base font-medium text-black shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2'>
							Buy
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
