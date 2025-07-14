import React from "react";
import { useSelector } from "react-redux";

import { MapPin, Building2, Camera, Utensils } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/components/ui/card";

export default function Dashboard() {
  const states = useSelector((state) => state.states.states);
  const cities = useSelector((state) => state.cities.cities);
  const places = useSelector((state) => state.places.places);
  const foods = useSelector((state) => state.foods.foods);

  const stats = [
    {
      name: "Total States",
      value: states?.length,
      icon: MapPin,
      color: "text-blue-600",
    },
    {
      name: "Total Cities",
      value: cities?.length,
      icon: Building2,
      color: "text-green-600",
    },
    {
      name: "Total Places",
      value: places?.length,
      icon: Camera,
      color: "text-purple-600",
    },
    {
      name: "Total Foods",
      value: foods?.length,
      icon: Utensils,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome to Tourist CMS
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage your tourist information system efficiently
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent States</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {states.slice(0, 3).map((state) => (
                <div key={state.id} className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{state.title}</p>
                    <p className="text-xs text-gray-500">{state.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Cities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cities?.slice(0, 3)?.map((city) => (
                <div key={city.id} className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{city.name}</p>
                    <p className="text-xs text-gray-500">
                      State: {city.stateId}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
