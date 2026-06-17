using System.Drawing;

namespace Homework4_
{
    internal class Program
    {
        public class Shirt
        {

            public static string[] Colors = { "red", "blue", "green" };
            public static string[] Patterns = { "striped", "plain", "checkered" };
            public string color { get; set; }
            public string pattern { get; set; }

        }
        static void Main(string[] args)
        {
            for (int i = 0; i < 3; i++)
            {
                Shirt shirt = new Shirt();
                shirt.color = Shirt.Colors[i];
                for (int j = 0; j < 3; j++)
                {
                    shirt.pattern = Shirt.Patterns[j];
                    Console.WriteLine(shirt.color + " " + shirt.pattern);
                }
            }

        }
    }
}
