import { useLocation, useNavigate } from "react-router-dom";
import {
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger
} from "@nextui-org/react";
import routes from "../../routes/routes.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faShippingFast } from "@fortawesome/free-solid-svg-icons";

const ChevronDownIcon = (props) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
    >
        <path d="m6 9 6 6 6-6"/>
    </svg>
);

export default function AdminBreadCrumbs() {
    const location = useLocation();
    const navigate = useNavigate();

    const getBreadcrumbs = () => {
        const pathnames = location.pathname.split("/").filter(x => x);
        const breadcrumbs = pathnames.map((_, index) => {
            const url = `/${pathnames.slice(0, index + 1).join("/")}`;
            let routeName = "Не найдено";

            Object.keys(routes).forEach((key) => {
                if (routes[key].url === url) {
                    routeName = routes[key].name;
                } else if (typeof routes[key] === "object") {
                    Object.keys(routes[key]).forEach((subKey) => {
                        if (routes[key][subKey].url === url) {
                            routeName = routes[key][subKey].name;
                        }
                    });
                }
            });

            return { name: routeName, url };
        });

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    const handleNavigate = (url) => {
        navigate(url);
    };

    return (
        <Breadcrumbs underline="hover" classNames={{ list: "bg-[#006FEE] shadow-small " }}
                     itemClasses={{ item: "text-white/60 data-[current=true]:text-white", separator: "text-white/40" }}
                     variant="solid">
            {breadcrumbs.map((breadcrumb, index) => {
                if (index === breadcrumbs.length - 1) {
                    return (
                        <BreadcrumbItem classNames={{ item: "px-0" }} key={index}>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button className="h-6 pr-2 text-small text-white/80" radius="full" size="sm"
                                            endContent={<ChevronDownIcon className="text-white" />}
                                            variant="light">
                                        {breadcrumb.name}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Routes">
                                    <DropdownItem key="info"
                                                  onClick={() => handleNavigate(routes.admin.routeAdminInfo.url)}
                                                  isDisabled={location.pathname === routes.admin.routeAdminInfo.url}>
                                        {routes.admin.routeAdminInfo.name}
                                    </DropdownItem>
                                    <DropdownItem key="media"
                                                  onClick={() => handleNavigate(routes.admin.routeAdminMedia.url)}
                                                  isDisabled={location.pathname === routes.admin.routeAdminMedia.url}>
                                        {routes.admin.routeAdminMedia.name}
                                    </DropdownItem>
                                    <DropdownItem key="map"
                                                  onClick={() => handleNavigate(routes.admin.routeAdminMap.url)}
                                                  isDisabled={location.pathname === routes.admin.routeAdminMap.url}>
                                        {routes.admin.routeAdminMap.name}
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </BreadcrumbItem>
                    );
                }
                return (
                    <BreadcrumbItem key={index} href={breadcrumb.url}>
                        {breadcrumb.name}
                    </BreadcrumbItem>
                );
            })}
        </Breadcrumbs>
    );
}
