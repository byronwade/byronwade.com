import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function RightSidebar({ children }, props) {
	return (
		<div className={props.className}>
			<div class='right-sidebar'>
				<FontAwesomeIcon icon={faHouse} />
			</div>
		</div>
	);
}

export default RightSidebar;
