import Footer from "./footer";
import Header from "./header";
import Nav from "./nav";
import RightSidebar from "./rightSidebar";

function PageContent({children}) {
    return ( 
		<>
			<Header />
			<div className="p-10 grid grid-cols-12 gap-4">
				<Nav className="col-span-2" />
				<div className='col-span-9'>
					{children}
				</div>
				<RightSidebar className="col-span-1" />
				<Footer />
			</div>
		</>
    );
}

export default PageContent;