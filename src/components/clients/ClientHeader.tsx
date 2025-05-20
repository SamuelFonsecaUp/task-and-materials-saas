
import React from "react";

interface ClientHeaderProps {
  name: string;
  logo: string;
  industry?: string;
}

const ClientHeader = ({ name, logo, industry }: ClientHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="h-14 w-14 rounded-md overflow-hidden">
        <img
          src={logo}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-sm text-muted-foreground">{industry || "Empresa"}</p>
      </div>
    </div>
  );
};

export default ClientHeader;
