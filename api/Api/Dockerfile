﻿FROM mcr.microsoft.com/dotnet/sdk:8.0

RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

EXPOSE 8080
EXPOSE 8081

WORKDIR /src
COPY ["Api/Api.csproj", "Api/"]
RUN dotnet restore "Api/Api.csproj"
COPY . .
WORKDIR "/src/Api"
RUN dotnet publish "Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

ENTRYPOINT "/src/Api/entrypoint.sh"
