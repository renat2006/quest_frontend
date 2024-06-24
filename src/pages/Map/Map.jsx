import {Card, CardBody, CardHeader} from "@nextui-org/react";

const Map = () => {
    return (
        <div className="quest--container">
            <Card className="py-4">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">

                    <h4 className="font-bold text-large">Маршрут</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                    <div style={{position:"relative",overflow:"hidden"}}><a
                        href="https://yandex.ru/maps/43/kazan/?utm_medium=mapframe&utm_source=maps"
                        style={{color: "#eee", fontSize: "12px", position: "absolute", top: "0px"}}>Казань</a><a
                        href="https://yandex.ru/maps/43/kazan/?feedback=map%2Fedit&feedback-context=map.controls&ll=49.119387%2C55.795739&rtext=55.787343%2C49.121643~55.792183%2C49.112341~55.796507%2C49.108242~55.800488%2C49.105163~55.802922%2C49.109535~55.801579%2C49.125676~55.794958%2C49.134861~55.794320%2C49.121330&rtt=pd&ruri=~~~~~~~&utm_medium=mapframe&utm_source=maps&z=15"
                        style={{color: "#eee", fontSize: "12px", position: "absolute", top: "14px"}}>улица Лобачевского: как доехать на
                        автомобиле, общественным транспортом или пешком – Яндекс Карты</a>
                        <iframe
                            src="https://yandex.ru/map-widget/v1/?feedback=map%2Fedit&feedback-context=map.controls&ll=49.119387%2C55.795739&rtext=55.787343%2C49.121643~55.792183%2C49.112341~55.796507%2C49.108242~55.800488%2C49.105163~55.802922%2C49.109535~55.801579%2C49.125676~55.794958%2C49.134861~55.794320%2C49.121330&rtt=pd&ruri=~~~~~~~&z=15"
                            width="560" height="400" frameBorder="1" allowFullScreen="true"
                            style={{position:"relative"}}></iframe>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}
export default Map