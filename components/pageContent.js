import Footer from "./footer";
import Header from "./header";
import Nav from "./nav";
import RightSidebar from "./rightSidebar";

function PageContent({children}) {
    return ( 
		<>
			<Header />
			<div>
				<Nav/>
				<div>
					{children}
				</div>
				<RightSidebar/>
				<Footer />
			</div>
		</>
    );
}

export default PageContent;